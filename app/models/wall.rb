class Wall < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  has_many :contributions, dependent: :destroy

  validates :owner, presence: true
  validates :context, presence: true

  def paint_contribution(content, user_id)
    puts "Painting contribution", content, user_id, id
    transaction do
      # contribution = contributions.build(content: content, user_id: user_id)
      contribution = Contribution.new(content: content, user_id: user_id, wall_id: id)
      contribution.save
      puts contribution.inspect
      self.contributions << contribution
      save
    end
  end

  def finish_painting
    @end_time = Time.now
  end
end
