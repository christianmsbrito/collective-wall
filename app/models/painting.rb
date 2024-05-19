class Painting < ApplicationRecord
  has_many :styles, as: :styleable
  has_many :themes, as: :themeable
  has_one :medium, as: :mediable
  has_many :compositions, as: :composable
  belongs_to :color_palette
  belongs_to :additional_features
  belongs_to :perspective
end
