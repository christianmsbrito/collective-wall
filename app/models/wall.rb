class Wall < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  has_many :contributions, dependent: :destroy

  validates :owner, presence: true
  validates :context, presence: true

  before_create :set_default_is_closed

  def set_default_is_closed
    self.is_closed ||= false
  end

  def paint_contribution(content, user_id)
    transaction do
      contribution = contributions.build(content: content, user_id: user_id)
      contribution.save!
      contribution
    end
  end

  def finish_painting(image_url)
    if URI::DEFAULT_PARSER.make_regexp.match?(image_url)
      @end_time = Time.now
      # Additional logic for handling a valid image URL
    else
      # Logic for handling an invalid image URL
    end
  end

  def painting_prompt
    context + contributions.pluck(:content).join(' ')
  end
end
